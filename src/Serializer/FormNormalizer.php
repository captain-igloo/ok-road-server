<?php

declare(strict_types=1);

namespace App\Serializer;

use Symfony\Component\Form\FormInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class FormNormalizer implements NormalizerInterface
{
    public function __construct(private CsrfTokenManagerInterface $csrfTokenManager)
    {
    }

    public function normalize($form, ?string $format = null, array $context = []): array
    {
        $normalized = [
            'fields' => [],
            'token' => $this->csrfTokenManager->getToken($form->getName())->getValue(),
        ];

        if (count($form->getErrors()) > 0) {
            $normalized['errors'] = [];
            foreach ($form->getErrors() as $e) {
                $normalized['errors'][] = $e->getMessage();
            }
        }

        foreach ($form as $k => $v) {
            $data = $v->getData();
            $errors = $v->getErrors();
            if ($data !== null || count($errors) > 0) {
                $normalized['fields'][$k] = [];
                if ($data !== null) {
                    $normalized['fields'][$k]['value'] = $data;
                }
                if (count($errors) > 0) {
                    $errorMessages = [];
                    foreach ($errors as $error) {
                        $errorMessages[] = $error->getMessage();
                    }
                    $normalized['fields'][$k]['errors'] = $errorMessages;
                }
            }
        }

        return $normalized;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof FormInterface;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            FormInterface::class => true,
        ];
    }
}
